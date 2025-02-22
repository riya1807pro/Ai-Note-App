import Navbar from "./Navbar";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return(
      <>
      <Navbar/>
      <main className="p-4 m-auto max-w-7">{children}</main>
      </>
    )
  }