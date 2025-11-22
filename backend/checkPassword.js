import bcrypt from "bcryptjs";

const run = async () => {
  const password = "PASTE_PASSWORD_FROM_EMAIL"; // replace this with the password you got in email
  const hash = "$2b$10$SvHVhPK5CpNfQnhSVwZVGuDeYH.GSHEsj6MDENSRctGhD0y3bjODW"; // replace with DB hash

  const match = await bcrypt.compare(password, hash);
  console.log("Does the password match the hash?", match);
};

run();
