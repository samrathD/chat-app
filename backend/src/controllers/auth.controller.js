export const signup = (req, res) => {
  const {email, fullName, password} = req.body;
  try{
    
  }catch(err){

  }
  res.send("signup route");
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
