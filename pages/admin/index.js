import { HeaderAdmin } from "./components/HeaderAdmin";
import CheckLogin from "./services/CheckLogin";


export default function Home() {


  return (
    <CheckLogin>
        <HeaderAdmin />
    </CheckLogin>
  );
}
