import { Request, Response, NextFunction } from "express";
import { FedexPackagesService } from "../../services/admin/fedex-packages.service";
import { generateFedexDelayReportPDF } from "../../utils/pdf";

export class AdminFedexPackagesController {
  private fedexPackagesService: FedexPackagesService;

  constructor() {
    this.fedexPackagesService = new FedexPackagesService();
  }

  private calculateDelayedDays(expectedDate: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expected = new Date(expectedDate);
    expected.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - expected.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  async getAllPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId, isActive, isDelivered, pageNo } = req.query;

      const queryData = {
        caseId: caseId as string,
        isActive:
          isActive === "true" ? true : isActive === "false" ? false : undefined,
        isDelivered:
          isDelivered === "true"
            ? true
            : isDelivered === "false"
            ? false
            : undefined,
        pageNo: pageNo ? parseInt(pageNo as string) : undefined,
      };

      const response = await this.fedexPackagesService.findAll(queryData);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async toggleActiveStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.fedexPackagesService.toggleActive(
        req.params.packageId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async getDelayedPackagesCount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.fedexPackagesService.getDelayedCount();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async getDelayedPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.fedexPackagesService.getDelayedPackages();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async generateDelayReport(req: Request, res: Response, next: NextFunction) {
    try {
      // Get delayed packages from database
      const { data: delayedPackages } =
        await this.fedexPackagesService.getDelayedPackages();

      if (!delayedPackages || delayedPackages?.length === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "No delayed packages found",
        });
      }

      // Prepare data for the template
      const reportData = {
        title: "Delayed Packages Report",
        generatedOn: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        packages: delayedPackages.map((pkg) => ({
          trackingNumber: pkg.trackingNumber,
          expectedDeliveryDate: new Date(pkg.expectedDate).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          ),
          delayedBy: this.calculateDelayedDays(new Date(pkg.expectedDate)),
        })),
        totalDelayed: delayedPackages.length,
      };

      // Generate PDF
      const pdfBuffer = await generateFedexDelayReportPDF(reportData);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="delayed-packages-report-${
          new Date().toISOString().split("T")[0]
        }.pdf"`,
        "Cache-Control": "no-cache",
      });

      // Send the PDF buffer directly
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating delay report:", error);
      next(new Error((error as Error).message));
    }
  }
}
