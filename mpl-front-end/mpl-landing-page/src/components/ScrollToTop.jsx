import { useLayoutEffect  } from "react";
import { useLocation} from "react-router-dom";

export default function ScrollToTop(){
    const {pathName}=useLocation();
    useLayoutEffect(()=>{
        window.scrollTo(0,0);
    },[pathName]);

    return null;
}