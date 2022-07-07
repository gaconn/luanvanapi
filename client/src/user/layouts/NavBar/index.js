import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import { useNavigate } from "react-router-dom";
import token from "../../services/utils/setToken";
import { FaUserAlt } from "react-icons/fa";


const NavbarHeader = () => {
    const navigate = useNavigate()
    const logoutHandler = () => {
        localStorage.removeItem("UID")
        localStorage.removeItem("USER_NAME")
        token.deleteToken()
        navigate("/home", {replace:true})
    }
    console.log(localStorage.getItem("UID"));
    return (
        <>
            <Navbar  bg="light" variant="light" expand="lg" sticky="top">
                <Container >
                    <Navbar.Brand href="Home">Linh kiện ô tô</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">  
                                <Nav
                                    className="me-auto my-4 my-lg-4 grid grid-cols-3 gap-4"
                                    style={{ maxHeight: '100px' }}
                                    navbarScroll
                                >
                                
                                    <Nav.Link href="/">Trang chủ</Nav.Link>
                                    <Nav.Link href="/Shop">Cửa hàng</Nav.Link>
                                    <Nav.Link href="/Contact">Liên hệ</Nav.Link>
                                    <Nav.Link href="/Blog">Bản tin</Nav.Link>
                                </Nav>

                           
                                <Dropdown >
                                    <Dropdown.Toggle variant='' id="dropdown-button-dark-example1" className="d-flex align-items-center" >
                                        <FaUserAlt />
                                        <div className="p-1">{localStorage.getItem("USER_NAME") ?localStorage.getItem("USER_NAME"): "Tài khoản"}</div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu variant="dark">
                                        <Dropdown.Item href="#/action-1" active>
                                            Thông tin khách hàng
                                        </Dropdown.Item>
                                        {!localStorage.getItem("UID") && 
                                        <>
                                            <Dropdown.Item  href="/Login"><i className="fa fa-user" aria-hidden="true"></i>&nbsp;Đăng nhập</Dropdown.Item>
                                            <Dropdown.Item  href="/Register"><i className="fa fa-user-plus" aria-hidden="true"></i>&nbsp; Đăng ký</Dropdown.Item>
                                        </>
                                        }
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={logoutHandler}><i className="fa fa-sign-out" aria-hidden="true"></i>&nbsp;Đăng xuất</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            
                        

                    </Navbar.Collapse>
                </Container>
                
            </Navbar>

        </>
    );
}

export default NavbarHeader;