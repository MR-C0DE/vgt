import { HeaderAdmin } from "@/components/HeaderAdmin";
import RoleGuard from "@/components/RoleGuard";
import { PERMISSIONS } from "@/constants/roles";
import MessageList from "@/components/MessageList";
import Head from "next/head";

export default function Messages() {
  return (
    <>
      <RoleGuard allowedRoles={PERMISSIONS.MESSAGES}>
      <Head>
        <title>Message - Admin | Voice of God Tabernacle</title>
        <meta name="description" content="Gestion des messages reçus par Voice of God Tabernacle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeaderAdmin />
      <MessageList />
      </RoleGuard>
    </>
  );
}
