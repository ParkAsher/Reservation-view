import React, { useEffect, useState } from 'react'
import firebase from '../firebase';
import { Container, Form, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, loginUser } from '../Reducer/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/* assets */
import '../Assets/AdminMainpage.css';

function AdminMainpage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [ProfileImage, setProfileImage] = useState("");
    const [StudioImage, setStudioImage] = useState("");

    const user = useSelector((state) => state.user);

    useEffect(() => {

        firebase.auth().onAuthStateChanged((userInfo) => {

            if (userInfo !== null) {
                dispatch(loginUser(userInfo.multiFactor.user));
            } else {
                dispatch(clearUser());
            }

        })

    }, [])

    useEffect(() => {

        if (user.isLoading && !user.accessToken) {
            navigate("/adm");
        }

    }, [user])

    const logoutHandler = () => {
        firebase.auth().signOut();
        navigate("/adm");
    }

    /* studio */
    const studiofileUpload = (e) => {
        console.log(e);

        var formData = new FormData();
        formData.append("file", (e.target.files[0]));

        axios.post("/api/post/image/upload", formData).then((res) => {
            if (res.data.success) {
                setStudioImage(res.data.filePath);
            }
        });
    }

    const studioonSubmit = (e) => {

        e.preventDefault();

        if (StudioImage === "") {
            return alert("이미지를 선택해주세요.");
        }

        let body = {
            imageType: "studio",
            image: StudioImage
        }

        axios.post("/api/post/submit", body).then((res) => {

            if (res.data.success) {
                window.location.reload();
            } else {
                alert("이미지 등록 실패!");
            }

        }).catch((err) => {
            console.log(err);
        })
    }

    /* profile */
    const profileFileUpload = (e) => {
        console.log(e);

        var formData = new FormData();
        formData.append("file", (e.target.files[0]));

        axios.post("/api/post/image/upload", formData).then((res) => {
            if (res.data.success) {
                setProfileImage(res.data.filePath);
            }
        });
    }

    const profileonsubmit = (e) => {

        e.preventDefault();

        if (ProfileImage === "") {
            return alert("이미지를 선택해주세요.");
        }

        let body = {
            imageType: "profile",
            image: ProfileImage
        }

        axios.post("/api/post/submit", body).then((res) => {

            if (res.data.success) {
                window.location.reload();
            } else {
                alert("이미지 등록 실패!");
            }

        }).catch((err) => {
            console.log(err);
        })
    }


    return (
        <>
            <header id='header'>
                <Navbar expand='lg'>
                    <Container>
                        <Navbar.Brand>관리자페이지</Navbar.Brand>
                        <button onClick={() => logoutHandler()}>로그아웃</button>
                    </Container>
                </Navbar>
            </header>
            <div id='admin-body'>
                <Container>
                    <div className='admin-body-profile-image'>
                        <div className='admin-body-title'>
                            <h2>프로필 이미지 수정</h2>
                        </div>
                        <div className='admin-body-content'>
                            <Form.Control type='file' accept='image/*' onChange={(e) => profileFileUpload(e)}></Form.Control>
                        </div>
                        <div className='admin-body-submit-button'>
                            <button onClick={(e) => { profileonsubmit(e) }}>등록</button>
                        </div>
                    </div>
                    <div className='admin-body-studio-image'>
                        <div className='admin-body-title'>
                            <h2>작업실 이미지 수정</h2>
                        </div>
                        <div className='admin-body-content'>
                            <Form.Control type='file' accept='image/*' onChange={(e) => studiofileUpload(e)}></Form.Control>
                        </div>
                        <div className='admin-body-submit-button'>
                            <button onClick={(e) => { studioonSubmit(e) }}>등록</button>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default AdminMainpage