"use strict";

import { Response, Request, NextFunction } from "express";

// Java SDK routes
export let javaPage1 = (req: Request, res: Response) => {
  res.render("sdk/java", {
  });
};

// Java SDK routes
export let javaPage2 = (req: Request, res: Response) => {
  res.render("sdk/java2", {
  });
};

// TBD: add routes for other SDK samples
