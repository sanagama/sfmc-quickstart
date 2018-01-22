"use strict";

import { Response, Request, NextFunction } from "express";


/**
 * GET /api
 * List of API examples.
 */
export let index = (req: Request, res: Response) => {
  res.render("sdk/index", {
    title: "SDK Quickstart"
  });
};
