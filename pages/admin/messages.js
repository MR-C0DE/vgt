import { HeaderAdmin } from "./components/HeaderAdmin";
import MessageList from "./components/MessageList";
import CheckLogin from "./services/CheckLogin";


export default function Messages() {


  return (
    <CheckLogin>
        <HeaderAdmin />
        <MessageList />
    </CheckLogin>
  );
} 
