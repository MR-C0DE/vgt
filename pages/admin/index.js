import { HeaderAdmin } from "@/components/HeaderAdmin";
import CheckLogin from "@/components/CheckLogin";


export default function Home() {
  return (
    <CheckLogin>
        <HeaderAdmin />
    </CheckLogin>
  );
} 
