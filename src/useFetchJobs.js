import axios from "axios";
import { useReducer, useEffect } from "react";

const ACTIONS = {
  MAKE_REQUEST: "MAKE_REQUEST",
  GET_DATA: "GET_DATA",
  ERROR: "ERROR",
  UPDATE_HAS_NEXT_PAGE: "UPDATE_HAS_NEXT_PAGE",
};

const BASE_URL =
  "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json";

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] };

    case ACTIONS.GET_DATA:
      return { ...state, loading: false, jobs: action.payload };

    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        jobs: [],
      };

    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload };

    default:
      return state;
  }
};

export const useFetchJobs = (params, page) => {
  const [state, dispatch] = useReducer(reducer, {
    jobs: [],
    loading: true,
  });

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    dispatch({ type: ACTIONS.MAKE_REQUEST });

    try {
      const getData = async () => {
        const res = await axios.get(BASE_URL, {
          cancelToken: cancelToken.token,
          params: { markdown: true, page: page, ...params },
        });

        dispatch({ type: ACTIONS.GET_DATA, payload: res.data });
      };

      const hasNextPage = async () => {
        const hasPage = await axios.get(BASE_URL, {
          cancelToken: cancelToken.token,
          params: { markdown: true, page: page + 1, ...params },
        });

        dispatch({
          type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
          payload: hasPage.data.length !== 0,
        });
      };

      hasNextPage();
      getData();
    } catch (error) {
      if (axios.isCancel(error)) return;
      dispatch({ type: ACTIONS.ERROR, payload: error });
    }

    return () => {
      cancelToken.cancel();
    };
  }, [params, page]);

  return state;
};
