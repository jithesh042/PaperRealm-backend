// import multer from "multer";
// import path from "path";

// // Create uploads folder if not exists
// import fs from "fs";
// const dir = "./uploads";
// if (!fs.existsSync(dir)) fs.mkdirSync(dir);

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const fileFilter = (req, file, cb) => {
//   // accept image or pdf only
//   const filetypes = /jpeg|jpg|png|gif|pdf/;
//   const extname = filetypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb("Only images and pdf allowed!");
//   }
// };

// export const upload = multer({ storage, fileFilter });

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Images or PDFs only!");
  }
}

export const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});
