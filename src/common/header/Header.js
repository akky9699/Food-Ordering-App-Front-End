// imports
import React, { Component } from "react";
import { withStyles, withTheme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Modal from "@material-ui/core/Modal";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SearchIcon from "@material-ui/icons/Search";
import FastFood from "@material-ui/icons/Fastfood";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Grid from "@material-ui/core/Grid";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import FormHelperText from "@material-ui/core/FormHelperText";
import "./Header.css";
import { Button, InputAdornment } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

function TabContainer(props) {
  return <div className="tab-container">{props.children}</div>;
}

const styles = {
  underline: {
    "&:after": {
      height: "2px",
      backgroundColor: "white"
    }
  }
};


class Header extends Component {
  state = {
    username: "",
    modalOpen: false,
    value: 0,
    isLoggedIn: false,
    renderProfileMenu: false,
    anchorEl: null,
    contactNumber: null,
    password: null,
    loginPasswordErrorDisplay: "none",
    loginContactErrorDisplay: "none",
    invalidErrorDisplay: "none",
    serverErrorDisplay: "none",
    errorMessage: "Required",
    firstName: null,
    lastName: null,
    email: null,
    signUpContactNumber: null,
    signUpPassword: null,
    firstNameErrorDisplay: "none",
    emailErrorDisplay: "none",
    passwordErrorDisplay: "none",
    contactErrorDisplay: "none",
    snack_open : false,
    snack_msg : null
  };

  // Login related methods to set data in state
  setContactNumberLogin = event => {
    this.setState({
      contactNumber: event.target.value
    });
    console.log(this.state.contactNumber);
  };

  setPasswordLogin = event => {
    const base64EncodedPassword = btoa(event.target.value);
    this.setState({
      password: event.target.value
    });
    console.log(this.state.password);
  };

  // Function to encode credentials in base64
  encodeBase64Login = str => {
    const base64EncodedAuth = btoa(str);
    return base64EncodedAuth;
  };

  // Sign up related function to set data in state
  setFirstName = event => {
    this.setState({
      firstName: event.target.value
    });
    console.log(this.state.firstName);
  };

  setLastName = event => {
    this.setState({
      lastName: event.target.value
    });
    console.log(this.state.lastName);
  };

  setEmail = event => {
    this.setState({
      email: event.target.value
    });
    console.log(this.state.email);
  };

  setSignUpPassword = event => {
    this.setState({
      signUpPassword: event.target.value
    });
    console.log(this.state.signUpPassword);
  };

  setSignUpContactNumber = event => {
    this.setState({
      signUpContactNumber: event.target.value
    });
    console.log(this.state.signUpContactNumber);
  };

  handleOpenModal = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  postData = async () => {
    const contactNumber = this.state.contactNumber;
    const password = this.state.password;
    const stringToEncode = contactNumber + ":" + password;
    const encodedAuth = btoa(stringToEncode);

    const postAddress_api_call = await fetch(
      "http://localhost:8080/api/customer/login",
      {
        method: "POST",
        headers: {
          authorization: "Basic " + encodedAuth,
          "content-type": "application/json;charset=UTF-8"
        }
      }
    );

    const responseData = await postAddress_api_call.json();

    if (postAddress_api_call.status === 200) {
      const accessToken = postAddress_api_call.headers.get("access-token");
      const user = responseData.first_name;
      sessionStorage.setItem("access-token", accessToken);
      this.setState({
        username: user,
        isLoggedIn: true,
        snack_open: true,
        snack_msg:"Logged in successfully"
      });
    } else if (postAddress_api_call.status === 401) {
      const error = responseData.message;
      this.setState({
        serverErrorDisplay: "flex",
        errorMessage: error
      });
      return false;
    } else {
      // implement errors here
      const error = responseData.message;
    }
  };

  postSignUpData = async () => {
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const email = this.state.email;
    const password = this.state.signUpPassword;
    const contactNumber = this.state.signUpContactNumber;

    const data = {
      contact_number: contactNumber,
      email_address: email,
      first_name: firstName,
      last_name: lastName,
      password: password
    };

    const postAddress_api_call = await fetch(
      "http://localhost:8080/api/customer/signup",
      {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(data)
      }
    );

    const responseData = await postAddress_api_call.json();

    if (postAddress_api_call.status !== 201) {
      const error = responseData.message;
      if(responseData.code === "SGR-002"){
        this.setState({
          emailErrorDisplay: "flex",
          errorMessage: error
        });
      }else{
        this.setState({
          contactErrorDisplay: "flex",
          errorMessage: error
        });
      }


    } else if (postAddress_api_call.status === 201) {
      this.setState({
        contactErrorDisplay: "flex",
        errorMessage: null,
        snack_open: true,
        snack_msg:"Registered successfully! Please Login Now",
        value: 0
      });
    }
  };

  handleLogin = async () => {
    const contactNumber = this.state.contactNumber;
    const password = this.state.password;

    this.setState({
      loginPasswordErrorDisplay: "none",
      loginContactErrorDisplay: "none",
      invalidErrorDisplay: "none",
      serverErrorDisplay: "none",
      errorMessage: "Required",
      signUpErrorMessage: "Required"
    });

    if (contactNumber === null && password === null) {
      this.setState({
        loginPasswordErrorDisplay: "flex",
        loginContactErrorDisplay: "flex"
      });
    } else if (contactNumber === null) {
      this.setState({
        loginContactErrorDisplay: "flex"
      });
    } else if (contactNumber.length < 9) {
      this.setState({
        invalidErrorDisplay: "flex",
        errorMessage: "Invalid contact"
      });
    } else if (password === null) {
      this.setState({
        loginPasswordErrorDisplay: "flex"
      });
    } else {
      const response = await this.postData();
      if (response === false) {
        console.log("error");
      } else {
        this.setState({
          isLoggedIn: true
        });
        this.handleCloseModal();
      }
    }
  };

  handleLogout = () => {
    this.setState({ isLoggedIn: false, username: "" });
    window.sessionStorage.removeItem("access-token");
  };

  handleSignUp = () => {
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const email = this.state.email;
    const password = this.state.signUpPassword;
    const contactNumber = this.state.signUpContactNumber;

    this.setState({
      firstNameErrorDisplay: "none",
      emailErrorDisplay: "none",
      passwordErrorDisplay: "none",
      contactErrorDisplay: "none",
      errorMessage: "Required"
    });

    if (
      firstName === null &&
      email === null &&
      password === null &&
      contactNumber === null
    ) {
      this.setState({
        firstNameErrorDisplay: "flex",
        emailErrorDisplay: "flex",
        passwordErrorDisplay: "flex",
        contactErrorDisplay: "flex"
      });
    } else if (
      firstName !== null &&
      email !== null &&
      password !== null &&
      contactNumber !== null
    ) {
      this.postSignUpData();
    }
  };

  handleOpenProfileMenu = event => {
    this.setState({ renderProfileMenu: true });
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseProfileMenu = () => {
    this.setState({ renderProfileMenu: false });
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const open = Boolean(this.state.anchorEl);
    // const classes_style = useStyles();
    // const [open_check, setOpen] = React.useState(false);

    return (
      <div className="header-container">
        <AppBar className="navbar" position="static">
          <Toolbar>
            <Grid
              justify="space-between" // Add it here :)
              container
              style={{ alignItems: "center" }}
              spacing={24}
            >
              <Grid item>
                <FastFood className="navbar-brand" />
              </Grid>
              {!window.sessionStorage.getItem("access-token") ? (
                <Grid item>
                  <div className="search-bar-container">
                    <Input
                      classes={{
                        underline: classes.underline
                      }}
                      className="search-bar"
                      fullWidth={true}
                      placeholder="Search by Restaurant Name"
                      startAdornment={
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      }
                    />
                  </div>
                </Grid>
              ) : null}
              <Grid item>
                {!window.sessionStorage.getItem("access-token") ? (
                  <div className="logged_menu" >
                    <Button variant="contained" onClick={this.handleOpenModal}>
                      <AccountCircle style={{ marginRight: "5px" }} />
                      Login
                    </Button>
                  </div>
                ) : (
                  <div className="logged_menu" >
                    <Button
                      className="btn-profile"
                      onClick={this.handleOpenProfileMenu}
                    >
                      <AccountCircle
                        style={{ marginRight: "5px" }}
                        className="btn-profile"
                      />
                      {this.state.username}
                    </Button>
                    <Menu
                      className="my-menu"
                      id="menu-appbar"
                      anchorEl={this.state.anchorEl}
                      children="menu-list"
                      getContentAnchorEl={null}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center"
                      }}
                      open={open}
                      onClose={this.handleCloseProfileMenu}
                    >
                      {this.state.renderProfileMenu ? (
                        <div className="menu-item-container">
                          <MenuList id="menu-list">
                            <MenuItem className="menu-item">
                              My Profile
                            </MenuItem>
                            <MenuItem
                              className="menu-item"
                              onClick={this.handleLogout}
                            >
                              Logout
                            </MenuItem>
                          </MenuList>
                        </div>
                      ) : null}
                    </Menu>
                  </div>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          className="header-modal"
          open={this.state.modalOpen}
          onClose={this.handleCloseModal}
        >
          <div className="modal-container">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Login" />
              <Tab label="Signup" />
            </Tabs>
            {value === 0 && (
              <TabContainer>
                <FormControl className="login-form">
                  <Input
                    fullWidth={true}
                    placeholder="Contact No.*"
                    onChange={this.setContactNumberLogin}
                    aria-describedby="contact-error-text"
                  />
                  <FormHelperText
                    id="contact-error-text"
                    style={{
                      display: this.state.loginContactErrorDisplay,
                      color: "red"
                    }}
                  >
                    {this.state.errorMessage}
                  </FormHelperText>
                  <FormHelperText
                    id="invalid-error-text"
                    style={{
                      display: this.state.invalidErrorDisplay,
                      color: "red"
                    }}
                  >
                    {this.state.errorMessage}
                  </FormHelperText>
                  <div style={{ marginBottom: "10%" }}>
                    <Input
                      fullWidth={true}
                      placeholder="Password*"
                      id="passInput"
                      type="password"
                      style={{ marginTop: "10%" }}
                      onChange={this.setPasswordLogin}
                      aria-describedby="password-error-text"
                    />
                    <FormHelperText
                      id="password-error-text"
                      style={{
                        display: this.state.loginPasswordErrorDisplay,
                        color: "red"
                      }}
                    >
                      {this.state.errorMessage}
                    </FormHelperText>
                    <FormHelperText
                      id="server-error-text"
                      style={{
                        display: this.state.serverErrorDisplay,
                        color: "red",
                        marginTop: "10%"
                      }}
                    >
                      {this.state.errorMessage}
                    </FormHelperText>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    className="btn-login"
                    style={{ marginTop: "20%" }}
                    onClick={this.handleLogin}
                  >
                    Login
                  </Button>
                </FormControl>
              </TabContainer>
            )}
            {value === 1 && (
              <TabContainer>
                <FormControl className="login-form">
                  <Input
                    fullWidth={true}
                    placeholder="First Name *"
                    onChange={this.setFirstName}
                    aria-describedby="firstname-error-text"
                  />
                  <FormHelperText
                    id="firstname-error-text"
                    style={{
                      display: this.state.firstNameErrorDisplay,
                      color: "red"
                    }}
                  >
                    {this.state.errorMessage}
                  </FormHelperText>
                  <Input
                    fullWidth={true}
                    placeholder="Last Name"
                    id="passInput"
                    style={{ marginTop: "10%" }}
                    onChange={this.setLastName}
                  />
                  <Input
                    fullWidth={true}
                    placeholder="Email *"
                    id="passInput"
                    style={{ marginTop: "10%" }}
                    onChange={this.setEmail}
                    aria-describedby="email-error-text"
                  />
                  <FormHelperText
                    id="email-error-text"
                    style={{
                      display: this.state.emailErrorDisplay,
                      color: "red"
                    }}
                  >
                    {this.state.errorMessage}
                  </FormHelperText>
                  <Input
                    fullWidth={true}
                    placeholder="Password *"
                    id="passInput"
                    style={{ marginTop: "10%" }}
                    onChange={this.setSignUpPassword}
                    aria-describedby="signuppassword-error-text"
                  />
                  <FormHelperText
                    id="signuppassword-error-text"
                    style={{
                      display: this.state.passwordErrorDisplay,
                      color: "red"
                    }}
                  >
                    {this.state.errorMessage}
                  </FormHelperText>
                  <div style={{ marginTop: "10%", marginBottom: "10%" }}>
                    <Input
                      fullWidth={true}
                      placeholder="Contact No. *"
                      id="passInput"
                      onChange={this.setSignUpContactNumber}
                      aria-describedby="signupcontact-error-text"
                    />
                    <FormHelperText
                      id="signupcontact-error-text"
                      style={{
                        display: this.state.contactErrorDisplay,
                        color: "red",
                        marginBottom: "10%"
                      }}
                    >
                      {this.state.errorMessage}
                    </FormHelperText>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    className="btn-login"
                    style={{ marginTop: "30%" }}
                    onClick={this.handleSignUp}
                  >
                    Signup
                  </Button>
                </FormControl>
              </TabContainer>
            )}
          </div>
        </Modal>

        <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.snack_open}
        autoHideDuration={6000}
        onClose={this.handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{this.state.snack_msg}</span>}
      />



      </div>
      
      


    );
  }
}

// export
export default withStyles(styles)(Header);
