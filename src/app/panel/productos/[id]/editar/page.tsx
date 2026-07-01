import { PanelProductEditView } from "@/components/admin/panel-product-edit-view";

type PanelProductEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PanelProductEditPage({
  params,
}: PanelProductEditPageProps) {
  const { id } = await params;

  return <PanelProductEditView productId={id} />;
}
