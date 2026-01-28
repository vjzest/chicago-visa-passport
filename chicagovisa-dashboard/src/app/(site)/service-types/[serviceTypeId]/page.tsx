import ServiceTypeForm from "@/components/pages/service-type/service-type-form";

type ServiceTypeEditPageProps = {
  params: { serviceTypeId: string };
};

export default function ServiceTypeEditPage({
  params: { serviceTypeId },
}: ServiceTypeEditPageProps) {
  return <ServiceTypeForm serviceTypeId={serviceTypeId} />;
}
