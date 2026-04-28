import { Router, type IRouter } from "express";
import healthRouter from "./health";
import platformRouter from "./platform";
import industriesRouter from "./industries";
import companiesRouter from "./companies";
import investorsRouter from "./investors";
import dealsRouter from "./deals";

const router: IRouter = Router();

router.use(healthRouter);
router.use(platformRouter);
router.use(industriesRouter);
router.use(companiesRouter);
router.use(investorsRouter);
router.use(dealsRouter);

export default router;
