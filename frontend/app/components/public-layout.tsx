import PublicHeader from "./public-header";
import PublicFooter from "./public-footer";
import { useEffect } from "react";

type PublicLayoutProps = {
  children: React.ReactNode;
  pageTitle?: string;
  icon?: React.ReactNode;
  text?: string;
  link?: string;
};

export default function PublicLayout({
  children,
  pageTitle,
  icon,
  text,
  link,
}: PublicLayoutProps) {
  useEffect(() => {
    if (!pageTitle) return;
    document.title = `${pageTitle} • EDUQCM`;
  }, [pageTitle]);

  return (
    <>
      <PublicHeader icon={icon} text={text} link={link} />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}
