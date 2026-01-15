const ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    ASK_QUESTION: "/ask-question",
    COLLECTION: "/collections",
    COMMUNITY: "/communities",
    TAGS: "/tags",
    JOBS: "/jobs",
    PROFILE: (id: string) => `/profile/${id}`,
    TAG: (id: string) => `/tags/${id}`,
    QUESTION: (id: string) => `/questions/${id}`,
    SIGNIN_WITH_OAUTH: "signin-with-oauth",
};

export default ROUTES;
