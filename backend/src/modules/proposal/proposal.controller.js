import {
  createProposal,
  modifyProposal,
  removeProposal,
} from "./proposal.service.js";

import { apiError } from "../../utils/error.js";

export const create = async (req, res) => {
  try {
    const result = await createProposal(req.body);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json(apiError(err.status || 500, err.message, err.details));
  }
};

export const modify = async (req, res) => {
  try {
    const result = await modifyProposal(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json(apiError(err.status || 500, err.message, err.details));
  }
};

export const remove = async (req, res) => {
  try {
    const result = await removeProposal(req.params.id);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json(apiError(err.status || 500, err.message, err.details));
  }
};
