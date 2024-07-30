import React, { useState } from 'react'
import longlogo from './longlogo.PNG'; 
import smalllogo from './small.PNG';
import { useNavigate } from 'react-router-dom';
 
import './verification.css';

const Verification = () => {
    // const [code, setCode] = useState('');
    // const [error, setError]=useState('');

    // const handleVerification = (e) => {
    //     e.preventDefault();

    //     if (!code) {
    //         setError('Please enter the verification code');
    //       } else {
    //         setError('');
    //       }
    // {
    //     console.log(code,error);
    // }
    //     setCode("");
    // };
    const [code, setCode] = useState('123456');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleVerification = (e) => {
      e.preventDefault();
  
      if (!code) {
        setError('Please enter the verification code');
      } else {
        setError('');
        // You can add actual verification logic here
        // For now, we just navigate to the /about page
        navigate('/dashboard');
      }
    };
  return (
    <div>
        <div className="container-fluid">
            <div className='row'>
                <div className='col-12 col-md-6 left_page'>
                    <img src={longlogo} alt="Henai Health" className="logo-img" /> 
                </div>
                
                <div className=' col-12 col-md-6 right_page'>
                    <div className='verify_field'>
                        <div>
                            <img src={smalllogo} alt="Henai Health" className="small_logo" />
                        </div>
                        <div className='verify_heading'>
                            <h2>Verify that it's you</h2>
                            <p>We sent a verification code to the phone number attached to your account</p>
                        </div>
                        <form onSubmit={handleVerification}>
                        <div className="verify_code">
                            <label >Verification code*</label>
                            <input
                                type="text"
                                className="code"
                                id="code"
                                placeholder=''
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                // required
                                autoComplete="off"
                            />
                            {error && <div className='error'>{error}</div>}
                        </div>
                        <div className="verify_login">
                            <button type="submit" className="login" value="Verify and Login" >Verify and Login</button>
                        </div>
                        </form>
                        <div className='verify_info'>
                            <span>By logging into your account, you agree with our<a href='#'> Term & Condition</a> and <a href='#'>Privacy Statement</a></span>
                        </div>
                    </div>
                </div>        
            </div>
        </div>
    </div>
    
  )
}

export default Verification
