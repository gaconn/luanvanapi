import { useParams } from "react-router-dom"
import SideBar from "../layouts/SideBar"
import NhaCungCap from "./NhaCungCap"
import TheLoai from "./TheLoai"
import SanPham from "./SanPham"
const Main = () => {
    const {manage, option} = useParams()
    var pageBody 

    switch (manage) {
        case "supplier":
            pageBody = <NhaCungCap option={option} />
            break;
        case "category":
            pageBody = <TheLoai option={option}/>
            break;
        case "product": 
            pageBody = <SanPham option= {option} />
            break;
        default:
            break;
    }
    return (
        <div className="d-flex">
            <SideBar/>
            <div className="flex-fill">
                {pageBody}
            </div>
        </div>
    )
}

export default Main