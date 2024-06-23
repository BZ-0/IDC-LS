import path from "path";
import fs from "fs";

//
const resources = path.resolve(import.meta.dirname, "./resources/");
const webapplocal = path.resolve(import.meta.dirname, "./webapp/");
const webapp = path.resolve(import.meta.dirname, "../webapp/");
const inline = path.resolve(import.meta.dirname, "./");

//
const r0 = fs.existsSync(resources) ? resources : webapplocal;
const r1 = fs.existsSync(r0) ? r0 : inline;
const r2 = fs.existsSync(r1) ? r1 : r0;

//
export default {"@webapp": r1 };
