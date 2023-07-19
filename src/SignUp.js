import React, { useState } from "react";
import { auth } from './firebase'; 
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { Button, TextField, Container, Grid, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError("Error signing up with email and password");
    }
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return (
    <Container style={{backgroundColor: 'rgba(0,0,0,0.1)', marginTop: '50px', padding: '50px'}}>
      <Grid container spacing={3} direction="column" alignItems="center"> 
        <Grid item xs={12} sm={6} md={4}>
          <form onSubmit={handleSignUp}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  name="name"
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  name="mobile"
                  label="Mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  name="email"
                  label="Email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="primary" fullWidth style={{ width: '100%' }}>
                  Sign Up
                </Button>
              </Grid>
              {error && (
                <Grid item>
                  <p>{error}</p>
                </Grid>
              )}
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12} style={{textAlign: 'center', marginBottom: '15px', marginTop: '15px'}}>
          <Divider style={{marginRight: '15px', marginLeft: '15px'}} orientation="horizontal" flexItem /> 
          or 
          <Divider style={{marginRight: '15px', marginLeft: '15px'}} orientation="horizontal" flexItem /> 
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button variant="outlined" endIcon={<GoogleIcon />} fullWidth style={{ width: '100%' }} onClick={handleGoogleSignIn}>
            Sign up with Google
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Signup;
