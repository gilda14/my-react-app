import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

type PageTemplateProps = {
  children: ReactNode;
};

export default function PageTemplate({ children }: PageTemplateProps) {
  return (
    <>
      <div className="header-footer">
        <Header />
      </div>

      <main>{children}</main>

      <div className="header-footer">
        <Footer />
      </div>
    </>
  );
}
