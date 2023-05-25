import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};


export default function Index() {
  return (
    <div>
      Olá
      {/* TODO: On first login, show a modal and redirect user to complete his profile  */}
    </div>
  );
}
