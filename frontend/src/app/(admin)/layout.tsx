import Main from "../component/main";
import AuthProvider from "../component/providers/AuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Main>{children}</Main>
    </AuthProvider>
  );
}
