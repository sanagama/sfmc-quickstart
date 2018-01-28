"use strict";

import { Response, Request, NextFunction } from "express";

// REST API routes
export let restPage1 = (req: Request, res: Response) => {
  res.render("api/rest", {
  });
};

export let restPage2 = (req: Request, res: Response) => {
  res.render("api/rest2", {
  });
};

// SOAP API routes
export let soapPage1 = (req: Request, res: Response) => {
  res.render("api/soap", {
  });
};

export let soapPage2 = (req: Request, res: Response) => {
  res.render("api/soap2", {
  });
};
