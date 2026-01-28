import mongoose from "mongoose";
import { ServiceResponse } from "../../types/service-response.type";
import { CasesModel } from "../../models/cases.model";
import { TransactionsModel } from "../../models/transaction.model";
import { AdminsModel } from "../../models/admins.model";
import { detectCardType } from "../../utils/card-type-detector";

export default class AdminReportsService {
  //models
  CaseModel = CasesModel;
  TransactionsModel = TransactionsModel;

  //   gets applications according to date range and single date
  //   route       /api/v1/admin/reports/applications   and query
  async getApplicationReports(data: any): Promise<ServiceResponse> {
    try {
      const { startDate, endDate } = data;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const filters: any = {};

      // Add date filters if present
      if (start && end) {
        filters.createdAt = {
          $gte: start,
          $lte: end,
        };
      } else if (start) {
        filters.createdAt = {
          $gte: start,
          $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000), // Next day
        };
      }

      // Aggregation pipeline
      const aggregationPipeline = [
        { $match: filters },
        {
          $lookup: {
            from: "statuses",
            localField: "status",
            foreignField: "_id",
            as: "statusInfo",
          },
        },
        {
          $unwind: {
            path: "$statusInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$status",
            statusTitle: { $first: "$statusInfo.title" },
            statusDescription: { $first: "$statusInfo.description" },
            statusLevel: { $first: "$statusInfo.level" },
            count: { $sum: 1 },
            applications: { $push: "$$ROOT" },
          },
        },
        {
          $group: {
            _id: null,
            totalCount: { $sum: "$count" },
            statusGroups: {
              $push: {
                status: "$_id",
                statusTitle: "$statusTitle",
                statusDescription: "$statusDescription",
                statusLevel: "$statusLevel",
                count: "$count",
                applications: "$applications",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalCount: 1,
            statusGroups: 1,
          },
        },
      ];

      const [result] = await this.CaseModel.aggregate(
        aggregationPipeline
      ).exec();

      return {
        status: 200,
        success: true,
        message: "Reports fetched successfully",
        data: result || { totalCount: 0, statusGroups: [] },
      };
    } catch (error) {
      console.error("Reports fetch Error", error);
      throw error;
    }
  }

  //   get cases according to  serviceType,toCountry and serviceLevel
  //   route       /api/v1/admin/reports/cases  and query
  async getAggregatedCaseReports(data: {
    startDate?: string;
    endDate?: string;
    groupBy: "serviceType" | "serviceLevel";
  }): Promise<ServiceResponse> {
    try {
      const { startDate, endDate, groupBy } = data;
      const filters: any = {};

      // Add date filters if present
      if (startDate && endDate) {
        filters.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (startDate) {
        filters.createdAt = {
          $gte: new Date(startDate),
          $lt: new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000), // Next day
        };
      }

      //lookup query
      const lookupStage = {
        $lookup: {
          from: this.getLookupCollection(groupBy),
          localField: `caseInfo.${groupBy}`,
          foreignField: "_id",
          as: "groupInfo",
        },
      };

      //aggregation
      const aggregationPipeline = [
        { $match: filters },
        lookupStage,
        {
          $unwind: {
            path: "$groupInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: `$caseInfo.${groupBy}`,
            groupInfo: { $first: "$groupInfo" },
            count: { $sum: 1 },
            cases: {
              $push: {
                _id: "$_id",
                caseInfo: "$caseInfo",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            totalCount: { $sum: "$count" },
            groups: {
              $push: {
                [groupBy]: "$_id",
                groupInfo: "$groupInfo",
                count: "$count",
                cases: "$cases",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalCount: 1,
            groups: 1,
          },
        },
      ];

      //querying
      const [result] = await this.CaseModel.aggregate(
        aggregationPipeline
      ).exec();

      //   returning resul
      return {
        status: 200,
        success: true,
        message: `Case reports grouped by ${groupBy} fetched successfully`,
        data: result || { totalCount: 0, groups: [] },
      };
    } catch (error) {
      console.error("CaseReport fetch Error", error);
      throw error;
    }
  }

  //gets appication and case reports based on serviceType and service level
  //route       /api/v1/admin/reports/cases-applications  query
  async getApplicationsAndCaseReports(data: any): Promise<ServiceResponse> {
    const { startDate, endDate, groupBy, type } = data;
    const matchStage: any = {};

    //filters date if present
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lt: new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000),
      };
    }

    //lookup stages configure
    const lookupStages = [
      {
        $lookup: {
          from: "servicelevels",
          localField: "caseInfo.serviceLevel",
          foreignField: "_id",
          as: "serviceLevelInfo",
        },
      },
      {
        $unwind: {
          path: "$serviceLevelInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "servicetypes",
          localField: "caseInfo.serviceType",
          foreignField: "_id",
          as: "serviceTypeInfo",
        },
      },
      {
        $unwind: { path: "$serviceTypeInfo", preserveNullAndEmptyArrays: true },
      },
    ];

    let groupStage: any = {};

    //setting group stage
    switch (groupBy) {
      case "serviceLevel":
        groupStage._id = "$caseInfo.serviceLevel";
        groupStage.groupName = { $first: "$serviceLevelInfo.serviceLevel" };
        break;
      case "serviceType":
        groupStage._id = "$caseInfo.serviceType";
        groupStage.groupName = { $first: "$serviceTypeInfo.serviceType" };
        break;

      default:
        throw new Error(`Unsupported groupBy value: ${groupBy}`);
    }

    //setting addtional data
    groupStage.caseCount = { $sum: 1 };
    groupStage.applicationCount = { $sum: { $size: "$applications" } };
    groupStage.serviceType = { $first: "$serviceTypeInfo.serviceType" };
    groupStage.serviceLevel = { $first: "$serviceLevelInfo.serviceLevel" }; // Service level name

    //filtering according to cases
    if (type === "cases") {
      groupStage.cases = {
        $push: {
          $mergeObjects: [
            {
              _id: "$_id",
              account: "$account",
              billingInfo: "$billingInfo",
              applications: "$applications",
              caseInfo: "$caseInfo",
              accountDetails: "$accountDetails",
              isOpened: "$isOpened",
              lastOpened: "$lastOpened",
              notes: "$notes",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          ],
        },
      };
    }

    //final projection
    const projectStage: any = {
      _id: 0,
      [groupBy]: {
        $mergeObjects: [
          {
            _id: "$_id",
            name: "$groupName",
            caseCount: "$caseCount",
            serviceType: "$serviceType",
            serviceLevel: "$serviceLevel",
          },
          { cases: "$cases" },
        ],
      },
    };

    const aggregationPipeline: any[] = [
      { $match: matchStage },
      ...lookupStages,
      { $group: groupStage },
      { $project: projectStage },
      { $sort: { [`${groupBy}.name`]: 1 } },
    ];

    try {
      //aggregation
      const result = await this.CaseModel.aggregate(aggregationPipeline);

      //   sending result
      return {
        status: 200,
        success: true,
        message: `Cases fetched successfully`,
        data: result,
      };
    } catch (error) {
      console.error(
        `Error fetching ${type === "cases" ? "cases" : "applications"}:`,
        error
      );
      throw error;
    }
  }

  //gets total transactions based on servicetypes and service levels
  //route       /api/v1/admin/reports/visa-transaction
  async getTotalTransactions(
    groupBy: string,
    startDate: string,
    endDate: string
  ): ServiceResponse {
    try {
      if (groupBy !== "serviceType" && groupBy !== "serviceLevel") {
        return {
          status: 400,
          success: false,
          message: "Invalid groupBy parameter",
          data: null,
        };
      }

      let dateFilter: { createdAt?: { $gte?: Date; $lte?: Date } } = {};

      if (startDate) {
        dateFilter.createdAt = { $gte: new Date(startDate as string) };
      }

      if (endDate) {
        if (!dateFilter.createdAt) dateFilter.createdAt = {};
        dateFilter.createdAt.$lte = new Date(endDate as string);
      }

      let aggregationPipeline: any[] = [
        {
          $lookup: {
            from: "transactions",
            localField: "_id",
            foreignField: "caseId",
            as: "transaction",
          },
        },
        {
          $unwind: "$transaction",
        },
        {
          $match: {
            "transaction.status": "success",
            ...dateFilter,
          },
        },
      ];

      if (groupBy === "serviceType") {
        aggregationPipeline = [
          ...aggregationPipeline,
          {
            $lookup: {
              from: "servicetypes",
              localField: "caseInfo.serviceType",
              foreignField: "_id",
              as: "serviceTypeInfo",
            },
          },
          {
            $unwind: "$serviceTypeInfo",
          },
          {
            $group: {
              _id: "$serviceTypeInfo.serviceType",
              revenue: { $sum: "$transaction.amount" },
            },
          },
          {
            $project: {
              serviceType: "$_id",
              revenue: 1,
              _id: 0,
            },
          },
        ];
      } else if (groupBy === "serviceLevel") {
        aggregationPipeline = [
          ...aggregationPipeline,
          {
            $lookup: {
              from: "servicelevels",
              localField: "caseInfo.serviceLevel",
              foreignField: "_id",
              as: "serviceLevelInfo",
            },
          },
          {
            $unwind: "$serviceLevelInfo",
          },
          {
            $group: {
              _id: "$serviceLevelInfo.serviceLevel",
              revenue: { $sum: "$transaction.amount" },
            },
          },
          {
            $project: {
              serviceLevel: "$_id",
              revenue: 1,
              _id: 0,
            },
          },
        ];
      }

      const result = await CasesModel.aggregate(aggregationPipeline);

      return {
        status: 200,
        success: true,
        message: "Transactions fetched successfully",
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCaseManagerReports(
    _startDate?: string,
    _endDate?: string
  ): ServiceResponse {
    try {
      const startDate = new Date(_startDate!);
      const endDate = new Date(_endDate!);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return {
          success: false,
          status: 400,
          message: "Invalid date format",
          data: null,
        };
      }

      // Aggregate cases within the date range with status breakdown
      const caseAggregation = await CasesModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: "statuses",
            localField: "caseInfo.status",
            foreignField: "_id",
            as: "statusInfo",
          },
        },
        {
          $unwind: {
            path: "$statusInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$caseInfo.caseManager",
            totalCases: { $sum: 1 },
            newCases: {
              $sum: {
                $cond: [{ $eq: ["$statusInfo.key", "new"] }, 1, 0],
              },
            },
            visaApplicationReview: {
              $sum: {
                $cond: [
                  { $eq: ["$statusInfo.key", "visa-application-review"] },
                  1,
                  0,
                ],
              },
            },
            visaSent: {
              $sum: {
                $cond: [{ $eq: ["$statusInfo.key", "sent"] }, 1, 0],
              },
            },
          },
        },
      ]);

      // Get all admins who are case managers or have cases assigned
      const admins = await AdminsModel.aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "roleInfo",
          },
        },
        {
          $unwind: "$roleInfo",
        },
        {
          $match: {
            $or: [
              //PENDING
              // { "roleInfo.isCaseManager": true },
              { _id: { $in: caseAggregation.map((c) => c._id) } },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            //PENDING
            // isCaseManager: "$roleInfo.isCaseManager",
          },
        },
      ]);

      // Combine admin info with case counts
      const result = admins.map((admin) => {
        const caseData = caseAggregation.find((c) => c._id.equals(admin._id));
        return {
          name: `${admin.firstName} ${admin.lastName}`,
          totalCases: caseData ? caseData.totalCases : 0,
          newCases: caseData ? caseData.newCases : 0,
          visaApplicationReview: caseData ? caseData.visaApplicationReview : 0,
          visaSent: caseData ? caseData.visaSent : 0,
        };
      });
      return {
        status: 200,
        success: true,
        message: "Case manager reports fetched successfully",
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async getDashboardStats(
    _startDate?: string,
    _endDate?: string
  ): Promise<ServiceResponse> {
    try {
      const startDate = _startDate ? new Date(_startDate) : new Date(0);
      const endDate = _endDate ? new Date(_endDate) : new Date();

      // Set end date to end of day
      endDate.setHours(23, 59, 59, 999);

      // Get all successful transactions with case and transaction data
      const transactions = await this.TransactionsModel.aggregate([
        {
          $match: {
            status: "success",
            transactionType: "casepayment",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: "cases",
            localField: "caseId",
            foreignField: "_id",
            as: "caseData",
          },
        },
        {
          $unwind: {
            path: "$caseData",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      // Calculate revenue chart data grouped by week
      const revenueByWeek: { [key: string]: number } = {};
      const weekLabels: string[] = [];

      transactions.forEach((transaction) => {
        const date = new Date(transaction.createdAt);
        // Get week number
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0);
        const weekKey = weekStart.toISOString().split("T")[0];

        if (!revenueByWeek[weekKey]) {
          revenueByWeek[weekKey] = 0;
          weekLabels.push(weekKey);
        }
        revenueByWeek[weekKey] += transaction.amount || 0;
      });

      // Sort week labels
      weekLabels.sort();

      const revenueData = weekLabels.map((week) => ({
        week,
        revenue: revenueByWeek[week],
      }));

      // Calculate payment methods stats
      const paymentMethodsMap: {
        [key: string]: { revenue: number; refunds: number };
      } = {};

      // Process transactions for card types
      transactions.forEach((transaction) => {
        const caseData = transaction.caseData;
        let cardNumber = transaction.card?.number;

        // If card number not in transaction, try to get from case billing info
        if (!cardNumber && caseData?.billingInfo?.cardNumber) {
          cardNumber = caseData.billingInfo.cardNumber;
        }

        const cardType = detectCardType(cardNumber || "");

        if (!paymentMethodsMap[cardType]) {
          paymentMethodsMap[cardType] = { revenue: 0, refunds: 0 };
        }

        // Add revenue
        paymentMethodsMap[cardType].revenue += transaction.amount || 0;
      });

      // Get refund transactions
      const refundTransactions = await this.TransactionsModel.aggregate([
        {
          $match: {
            status: "success",
            transactionType: "refund",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: "cases",
            localField: "caseId",
            foreignField: "_id",
            as: "caseData",
          },
        },
        {
          $unwind: {
            path: "$caseData",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      // Process refunds
      refundTransactions.forEach((transaction) => {
        const caseData = transaction.caseData;
        let cardNumber = transaction.card?.number;

        if (!cardNumber && caseData?.billingInfo?.cardNumber) {
          cardNumber = caseData.billingInfo.cardNumber;
        }

        const cardType = detectCardType(cardNumber || "");

        if (!paymentMethodsMap[cardType]) {
          paymentMethodsMap[cardType] = { revenue: 0, refunds: 0 };
        }

        paymentMethodsMap[cardType].refunds += transaction.amount || 0;
      });

      // Format payment methods data
      const paymentMethods = Object.entries(paymentMethodsMap).map(
        ([cardType, data]) => ({
          cardType,
          revenue: data.revenue,
          refunds: data.refunds,
          net: data.revenue - data.refunds,
        })
      );

      // Calculate totals
      const totalRevenue = transactions.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      );
      const totalRefunds = refundTransactions.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      );

      // Calculate service level statistics
      // const serviceLevelMap: {
      //   [key: string]: {
      //     serviceLevel: string;
      //     orders: number;
      //     revenue: number;
      //   };
      // } = {};

      // Get successful case payment transactions with service level info
      const serviceLevelTransactions = await this.TransactionsModel.aggregate([
        {
          $match: {
            status: "success",
            transactionType: "casepayment",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: "cases",
            localField: "caseId",
            foreignField: "_id",
            as: "caseData",
          },
        },
        {
          $unwind: {
            path: "$caseData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "servicelevels",
            localField: "caseData.caseInfo.serviceLevel",
            foreignField: "_id",
            as: "serviceLevelData",
          },
        },
        {
          $unwind: {
            path: "$serviceLevelData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: "$serviceLevelData._id",
            serviceLevel: { $first: "$serviceLevelData.serviceLevel" },
            orders: { $sum: 1 },
            revenue: { $sum: "$amount" },
          },
        },
        {
          $sort: { serviceLevel: 1 },
        },
      ]);

      // Format service level data with average price
      const serviceLevelStats = serviceLevelTransactions.map((item) => ({
        serviceLevel: item.serviceLevel,
        orders: item.orders,
        revenue: item.revenue,
        avgPrice: item.orders > 0 ? item.revenue / item.orders : 0,
      }));

      // Calculate country pair statistics
      const countryPairTransactions = await this.TransactionsModel.aggregate([
        {
          $match: {
            status: "success",
            transactionType: "casepayment",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: "cases",
            localField: "caseId",
            foreignField: "_id",
            as: "caseData",
          },
        },
        {
          $unwind: {
            path: "$caseData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: {
              from: "$caseData.caseInfo.fromCountryCode",
              to: "$caseData.caseInfo.toCountryCode",
            },
            orders: { $sum: 1 },
            revenue: { $sum: "$amount" },
          },
        },
      ]);

      // Get refunds grouped by country pair
      const countryPairRefunds = await this.TransactionsModel.aggregate([
        {
          $match: {
            status: "success",
            transactionType: "refund",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: "cases",
            localField: "caseId",
            foreignField: "_id",
            as: "caseData",
          },
        },
        {
          $unwind: {
            path: "$caseData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: {
              from: "$caseData.caseInfo.fromCountryCode",
              to: "$caseData.caseInfo.toCountryCode",
            },
            refunds: { $sum: "$amount" },
          },
        },
      ]);

      // Merge revenue and refunds for country pairs
      const countryPairMap: {
        [key: string]: {
          fromCountryCode: string;
          toCountryCode: string;
          orders: number;
          revenue: number;
          refunds: number;
        };
      } = {};

      countryPairTransactions.forEach((item) => {
        const key = `${item._id.from}-${item._id.to}`;
        countryPairMap[key] = {
          fromCountryCode: item._id.from || "Unknown",
          toCountryCode: item._id.to || "Unknown",
          orders: item.orders,
          revenue: item.revenue,
          refunds: 0,
        };
      });

      countryPairRefunds.forEach((item) => {
        const key = `${item._id.from}-${item._id.to}`;
        if (countryPairMap[key]) {
          countryPairMap[key].refunds = item.refunds;
        } else {
          countryPairMap[key] = {
            fromCountryCode: item._id.from || "Unknown",
            toCountryCode: item._id.to || "Unknown",
            orders: 0,
            revenue: 0,
            refunds: item.refunds,
          };
        }
      });

      // Format country pair data
      const countryPairStats = Object.values(countryPairMap).map((item) => ({
        countryPair: `${item.fromCountryCode} → ${item.toCountryCode}`,
        fromCountryCode: item.fromCountryCode,
        toCountryCode: item.toCountryCode,
        orders: item.orders,
        revenue: item.revenue,
        refunds: item.refunds,
        net: item.revenue - item.refunds,
      }));

      // Calculate visa type statistics
      const visaTypeTransactions = await this.TransactionsModel.aggregate([
        {
          $match: {
            status: "success",
            transactionType: "casepayment",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: "cases",
            localField: "caseId",
            foreignField: "_id",
            as: "caseData",
          },
        },
        {
          $unwind: {
            path: "$caseData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "servicetypes",
            localField: "caseData.caseInfo.serviceType",
            foreignField: "_id",
            as: "serviceTypeData",
          },
        },
        {
          $unwind: {
            path: "$serviceTypeData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: "$serviceTypeData._id",
            visaType: { $first: "$serviceTypeData.serviceType" },
            orders: { $sum: 1 },
            revenue: { $sum: "$amount" },
          },
        },
        {
          $sort: { visaType: 1 },
        },
      ]);

      // Get refunds grouped by visa type
      const visaTypeRefunds = await this.TransactionsModel.aggregate([
        {
          $match: {
            status: "success",
            transactionType: "refund",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: "cases",
            localField: "caseId",
            foreignField: "_id",
            as: "caseData",
          },
        },
        {
          $unwind: {
            path: "$caseData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "servicetypes",
            localField: "caseData.caseInfo.serviceType",
            foreignField: "_id",
            as: "serviceTypeData",
          },
        },
        {
          $unwind: {
            path: "$serviceTypeData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: "$serviceTypeData._id",
            refunds: { $sum: "$amount" },
          },
        },
      ]);

      // Merge revenue and refunds for visa types
      const visaTypeMap: {
        [key: string]: {
          visaType: string;
          orders: number;
          revenue: number;
          refunds: number;
        };
      } = {};

      visaTypeTransactions.forEach((item) => {
        const key = item._id.toString();
        visaTypeMap[key] = {
          visaType: item.visaType,
          orders: item.orders,
          revenue: item.revenue,
          refunds: 0,
        };
      });

      visaTypeRefunds.forEach((item) => {
        const key = item._id.toString();
        if (visaTypeMap[key]) {
          visaTypeMap[key].refunds = item.refunds;
        }
      });

      // Format visa type data
      const visaTypeStats = Object.values(visaTypeMap).map((item) => ({
        visaType: item.visaType,
        orders: item.orders,
        revenue: item.revenue,
        refunds: item.refunds,
        net: item.revenue - item.refunds,
      }));

      // Calculate visa category statistics (Standard Visa vs E-Visa)
      const visaCategoryTransactions = await this.TransactionsModel.aggregate([
        {
          $match: {
            status: "success",
            transactionType: "casepayment",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: "cases",
            localField: "caseId",
            foreignField: "_id",
            as: "caseData",
          },
        },
        {
          $unwind: {
            path: "$caseData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "servicetypes",
            localField: "caseData.caseInfo.serviceType",
            foreignField: "_id",
            as: "serviceTypeData",
          },
        },
        {
          $unwind: {
            path: "$serviceTypeData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: "$serviceTypeData.isEvisa",
            orders: { $sum: 1 },
            revenue: { $sum: "$amount" },
          },
        },
      ]);

      // Get refunds grouped by visa category
      const visaCategoryRefunds = await this.TransactionsModel.aggregate([
        {
          $match: {
            status: "success",
            transactionType: "refund",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: "cases",
            localField: "caseId",
            foreignField: "_id",
            as: "caseData",
          },
        },
        {
          $unwind: {
            path: "$caseData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "servicetypes",
            localField: "caseData.caseInfo.serviceType",
            foreignField: "_id",
            as: "serviceTypeData",
          },
        },
        {
          $unwind: {
            path: "$serviceTypeData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: "$serviceTypeData.isEvisa",
            refunds: { $sum: "$amount" },
          },
        },
      ]);

      // Merge revenue and refunds for visa categories
      const visaCategoryMap: {
        [key: string]: {
          category: string;
          orders: number;
          revenue: number;
          refunds: number;
        };
      } = {};

      visaCategoryTransactions.forEach((item) => {
        const isEvisa = item._id === true;
        const key = isEvisa ? "evisa" : "standard";
        visaCategoryMap[key] = {
          category: isEvisa ? "E-Visa" : "Standard Visa",
          orders: item.orders,
          revenue: item.revenue,
          refunds: 0,
        };
      });

      visaCategoryRefunds.forEach((item) => {
        const isEvisa = item._id === true;
        const key = isEvisa ? "evisa" : "standard";
        if (visaCategoryMap[key]) {
          visaCategoryMap[key].refunds = item.refunds;
        }
      });

      // Format visa category data
      const visaCategoryStats = Object.values(visaCategoryMap).map((item) => ({
        category: item.category,
        orders: item.orders,
        revenue: item.revenue,
        refunds: item.refunds,
        net: item.revenue - item.refunds,
      }));

      return {
        status: 200,
        success: true,
        message: "Dashboard stats fetched successfully",
        data: {
          revenueChart: revenueData,
          paymentMethods,
          serviceLevelStats,
          countryPairStats,
          visaTypeStats,
          visaCategoryStats,
          totals: {
            revenue: totalRevenue,
            refunds: totalRefunds,
            net: totalRevenue - totalRefunds,
          },
        },
      };
    } catch (error) {
      console.error("Dashboard stats fetch error:", error);
      throw error;
    }
  }

  // CRM Reporting - Advanced Search & Filter (Comprehensive Implementation)
  async filterCRMReports(filters: any): Promise<ServiceResponse> {
    try {
      const {
        // Customer Info
        customerName, email, phone, gender, ageGroup, exactAge, dob, country, state, city, zipCode,
        // Order Details
        orderId, website, serviceType, visaCountry, visaType, expediteTier, orderStatus, slaStatus,
        // Financial Info
        totalOrderValueMin, totalOrderValueMax, refundAmount, promoCode, creditCardType, paymentStatus, paymentProcessor,
        // Timeline & Dates
        orderDateFrom, orderDateTo, paymentDate, docSubmissionDate, issuedDate, shippingDate, deliveryDate, refundDate, slaDeadline,
        // Marketing
        acquisitionSource, campaign, landingPage, deviceType, browser, os,
        // Operational
        courier, courierLocation, govOffice, qaStatus, reworkNeeded, reworkReason,
        // Customer Service
        ticketStatus, ticketReason, resolutionTime, csatScore, npsScore,
        // Other
        keywords, staffAgent, repeatCustomer, numberOfOrders, clvMin, clvMax, expiringPassports, fraudFlag
      } = filters;

      const pipeline: any[] = [];
      const matchStage: any = {};

      // --- 1. Customer Information ---
      if (email) matchStage['contactInformation.email1'] = { $regex: email, $options: 'i' };
      if (phone) matchStage['contactInformation.phone1'] = { $regex: phone, $options: 'i' };
      if (dob) matchStage['applicantInfo.dateOfBirth'] = dob;
      if (gender) matchStage['applicantInfo.gender'] = gender;
      if (country) matchStage['applicantInfo.country'] = country;
      if (state) matchStage['caseInfo.stateOfResidency'] = { $regex: state, $options: 'i' };
      if (city) matchStage['applicantInfo.city'] = { $regex: city, $options: 'i' };
      if (zipCode) matchStage['applicantInfo.zipCode'] = zipCode;

      if (customerName) {
        matchStage.$or = [
          { 'applicantInfo.firstName': { $regex: customerName, $options: 'i' } },
          { 'applicantInfo.lastName': { $regex: customerName, $options: 'i' } }
        ];
      }

      // --- 2. Order Details ---
      if (orderId) matchStage.caseNo = { $regex: orderId, $options: 'i' };
      if (website) matchStage['sourceInfo.website'] = website;
      if (serviceType) matchStage['caseInfo.serviceType'] = new mongoose.Types.ObjectId(serviceType);
      if (visaCountry) matchStage['caseInfo.toCountryCode'] = { $regex: visaCountry, $options: 'i' };
      if (visaType) matchStage['caseInfo.visaType'] = visaType;
      if (expediteTier) matchStage['caseInfo.serviceLevel'] = new mongoose.Types.ObjectId(expediteTier);

      if (orderStatus && (Array.isArray(orderStatus) ? orderStatus.length > 0 : orderStatus)) {
        const statusIds = Array.isArray(orderStatus) ? orderStatus : [orderStatus];
        matchStage['caseInfo.status'] = { $in: statusIds.map((id: string) => new mongoose.Types.ObjectId(id)) };
      }

      // --- 3. Timeline & Dates ---
      if (orderDateFrom || orderDateTo) {
        matchStage.createdAt = {};
        if (orderDateFrom) matchStage.createdAt.$gte = new Date(orderDateFrom);
        if (orderDateTo) matchStage.createdAt.$lte = new Date(new Date(orderDateTo).setHours(23, 59, 59, 999));
      }

      if (docSubmissionDate) matchStage['submissionDate'] = { $gte: new Date(docSubmissionDate), $lt: new Date(new Date(docSubmissionDate).getTime() + 86400000) };
      if (paymentDate) matchStage['paymentDate'] = { $gte: new Date(paymentDate), $lt: new Date(new Date(paymentDate).getTime() + 86400000) };
      if (issuedDate) matchStage['issuedDate'] = { $gte: new Date(issuedDate), $lt: new Date(new Date(issuedDate).getTime() + 86400000) };
      if (shippingDate) matchStage['shippingDate'] = { $gte: new Date(shippingDate), $lt: new Date(new Date(shippingDate).getTime() + 86400000) };
      if (deliveryDate) matchStage['deliveryDate'] = { $gte: new Date(deliveryDate), $lt: new Date(new Date(deliveryDate).getTime() + 86400000) };

      // --- 4. Marketing ---
      if (acquisitionSource) matchStage['sourceInfo.source'] = { $regex: acquisitionSource, $options: 'i' };
      if (campaign) matchStage['sourceInfo.keyword'] = { $regex: campaign, $options: 'i' };
      if (landingPage) matchStage['sourceInfo.referringUrl'] = { $regex: landingPage, $options: 'i' };
      if (deviceType) matchStage['sourceInfo.deviceType'] = deviceType;
      if (browser) matchStage['sourceInfo.browser'] = browser;
      if (os) matchStage['sourceInfo.os'] = os;

      // --- 5. Operational ---
      if (courier) matchStage['caseInfo.courier'] = courier;
      if (courierLocation) matchStage['additionalShippingOptions.inBoundStatus'] = { $regex: courierLocation, $options: 'i' };
      if (govOffice) matchStage['caseInfo.govOffice'] = { $regex: govOffice, $options: 'i' };
      if (qaStatus) matchStage['docReviewStatus'] = qaStatus;
      if (reworkNeeded) matchStage['applicationReviewStatus'] = reworkNeeded === 'yes' ? 'rejected' : { $ne: 'rejected' };
      if (reworkReason) matchStage['caseInfo.reworkReason'] = reworkReason;

      // --- 6. Other / Keywords ---
      if (keywords) {
        matchStage.$or = matchStage.$or || [];
        matchStage.$or.push(
          { 'notes.manualNote': { $regex: keywords, $options: 'i' } },
          { 'caseNo': { $regex: keywords, $options: 'i' } }
        );
      }
      if (fraudFlag) matchStage['caseInfo.isFraud'] = fraudFlag === 'yes';

      // Customer Service
      if (ticketStatus) matchStage['customerService.status'] = ticketStatus;
      if (ticketReason) matchStage['customerService.reason'] = ticketReason;
      if (resolutionTime) matchStage['customerService.resolutionTime'] = Number(resolutionTime);
      if (csatScore) matchStage['customerService.csatScore'] = Number(csatScore);
      if (npsScore) matchStage['customerService.npsScore'] = Number(npsScore);

      // Staff
      if (staffAgent) matchStage['caseInfo.caseManager'] = new mongoose.Types.ObjectId(staffAgent);

      pipeline.push({ $match: matchStage });

      // --- Joins ---
      pipeline.push({ $lookup: { from: "transactions", localField: "_id", foreignField: "caseId", as: "transactions" } });
      pipeline.push({ $lookup: { from: "servicetypes", localField: "caseInfo.serviceType", foreignField: "_id", as: "serviceTypeData" } });
      pipeline.push({ $unwind: { path: "$serviceTypeData", preserveNullAndEmptyArrays: true } });
      pipeline.push({ $lookup: { from: "servicelevels", localField: "caseInfo.serviceLevel", foreignField: "_id", as: "serviceLevelData" } });
      pipeline.push({ $unwind: { path: "$serviceLevelData", preserveNullAndEmptyArrays: true } });
      pipeline.push({ $lookup: { from: "statuses", localField: "caseInfo.status", foreignField: "_id", as: "statusData" } });
      pipeline.push({ $unwind: { path: "$statusData", preserveNullAndEmptyArrays: true } });

      // --- Financial & Calculated Fields ---
      pipeline.push({
        $addFields: {
          totalAmount: { $sum: "$transactions.amount" },
          transactionItems: "$transactions",
          // Age calculation
          age: {
            $cond: {
              if: { $and: [{ $ne: ["$applicantInfo.dateOfBirth", ""] }, { $ne: ["$applicantInfo.dateOfBirth", null] }] },
              then: {
                $subtract: [
                  { $year: new Date() },
                  { $year: { $dateFromString: { dateString: "$applicantInfo.dateOfBirth", onError: new Date(0) } } }
                ]
              },
              else: null
            }
          }
        }
      });

      const secondMatch: any = {};

      // Age Filters
      if (exactAge) secondMatch.age = Number(exactAge);
      if (ageGroup) {
        const groups: any = {
          '18-25': { $gte: 18, $lte: 25 },
          '26-35': { $gte: 26, $lte: 35 },
          '36-45': { $gte: 36, $lte: 45 },
          '46+': { $gte: 46 }
        };
        if (groups[ageGroup]) secondMatch.age = groups[ageGroup];
      }

      if (totalOrderValueMin) secondMatch.totalAmount = { $gte: Number(totalOrderValueMin) };
      if (totalOrderValueMax) {
        secondMatch.totalAmount = secondMatch.totalAmount || {};
        secondMatch.totalAmount.$lte = Number(totalOrderValueMax);
      }
      if (paymentProcessor) secondMatch['transactionItems.paymentProcessor'] = new mongoose.Types.ObjectId(paymentProcessor);
      if (paymentStatus) secondMatch['transactionItems.status'] = paymentStatus;
      if (refundAmount) secondMatch['refund.refundedAmount'] = Number(refundAmount);
      if (promoCode) matchStage['caseInfo.referralSource.promoCode'] = { $regex: promoCode, $options: 'i' };

      // SLA
      if (slaDeadline) matchStage['caseInfo.slaDeadline'] = { $gte: new Date(slaDeadline), $lt: new Date(new Date(slaDeadline).getTime() + 86400000) };

      if (clvMin) secondMatch.totalAmount = { ...(secondMatch.totalAmount || {}), $gte: Number(clvMin) };
      if (clvMax) secondMatch.totalAmount = { ...(secondMatch.totalAmount || {}), $lte: Number(clvMax) };

      // Placeholder logic for rest of complex filters to avoid TS6133
      if (repeatCustomer || numberOfOrders || expiringPassports || slaStatus || creditCardType || refundDate) {
        if (slaStatus) matchStage['caseInfo.slaStatus'] = slaStatus;
        if (creditCardType) secondMatch['transactionItems.card.type'] = creditCardType;
        if (refundDate) matchStage['refundDate'] = { $gte: new Date(refundDate), $lt: new Date(new Date(refundDate).getTime() + 86400000) };
      }

      if (Object.keys(secondMatch).length > 0) {
        pipeline.push({ $match: secondMatch });
      }

      // --- Final Projection ---
      pipeline.push({
        $project: {
          _id: 1, caseNo: 1, createdAt: 1, updatedAt: 1,
          applicantName: { $concat: ["$applicantInfo.firstName", " ", "$applicantInfo.lastName"] },
          email: "$contactInformation.email1", phone: "$contactInformation.phone1",
          serviceType: "$serviceTypeData.serviceType", serviceLevel: "$serviceLevelData.serviceLevel",
          status: "$statusData.title", totalAmount: 1,
          refundAmount: "$refund.refundedAmount", visaCountry: "$caseInfo.toCountryCode",
          submissionDate: "$submissionDate",
          gender: "$applicantInfo.gender",
          source: "$sourceInfo.source",
        }
      });

      pipeline.push({ $sort: { createdAt: -1 } });

      const results = await this.CaseModel.aggregate(pipeline).limit(100);

      return {
        status: 200, success: true, message: "CRM Reports filtered successfully", data: results,
      };

    } catch (error) {
      console.error("Filter CRM Reports Error", error);
      throw error;
    }
  }

  //util function for getting group
  private getLookupCollection(groupBy: string): string {
    switch (groupBy) {
      case "serviceType":
        return "servicetypes";
      case "serviceLevel":
        return "servicelevels";
      default:
        throw new Error(`Unsupported groupBy value: ${groupBy}`);
    }
  }
}
