export var lc_nav_pages = {
    feed: "feed",
    network: "network",
    messaging: "messaging",
    jobs: "jobs",
    invitationManager: "invitation-manager"
};

export var lc_element_xpath = {
    feed: {
        isClickable: true,
        elementTagName: "a",
        xPath: "//nav/ul/li[1]/a",
        windowLocation: "",
        attributes: {href: "https://www.linkedin.com/feed/", className: "", id: ""}
    },
    mynetwork: {
        isClickable: true,
        elementTagName: "a",
        xPath: "//nav/ul/li[2]/a",
        windowLocation: "",
        attributes: {href: "https://www.linkedin.com/mynetwork/", className: "", id: ""}
    },
    messaging: {
        isClickable: true,
        elementTagName: "a",
        xPath: "//nav/ul/li[3]/a",
        windowLocation: "",
        attributes: {href: "https://www.linkedin.com/messaging/", className: "", id: ""}
    },
    jobs: {
        isClickable: true,
        elementTagName: "a",
        xPath: "//nav/ul/li[4]/a",
        windowLocation: "",
        attributes: {href: "https://www.linkedin.com/jobs/", className: "", id: ""}
    },
    invitationManager: {
        isClickable: true,
        elementTagName: "a",
        xPath: "//nav/ul/li[2]/a",
        windowLocation: "",
        attributes: {href: "https://www.linkedin.com/mynetwork/invitation-manager/sent/?invitationType=ORGANIZATION", className: "", id: ""}
    }
}

export var lc_nav_cfg = {
    root: {
        logPrefix: "SN_1 ",
        postsXPath: "//",
        run: true,
        log: true,
        range: [5000, 6000],
        counter: 0,
        counterClear: 20,
        key: 'root',
    },
    pages: [
        {
            key: lc_nav_pages.feed,
            path:  lc_element_xpath.feed.attributes.href,
            xPath: lc_element_xpath.feed.xPath,
            timeOnPage: [31554, 41554],
            nextPageKey: lc_nav_pages.network,
            currentPage: true,
            run: true
        },
        {
            key: lc_nav_pages.network,
            path: lc_element_xpath.mynetwork.attributes.href,
            xPath: lc_element_xpath.mynetwork.xPath,
            timeOnPage: [31554, 41554],
            nextPageKey: lc_nav_pages.feed,
            currentPage: false,
            run: true
        },
        {
            key: lc_nav_pages.messaging,
            path: lc_element_xpath.messaging.attributes.href,
            xPath: lc_element_xpath.messaging.xPath,
            timeOnPage: [111554, 211554],
            nextPageKey: lc_nav_pages.feed,
            currentPage: false,
            run: true
        },
        {
            key: lc_nav_pages.jobs,
            path: lc_element_xpath.jobs.attributes.href,
            xPath: lc_element_xpath.jobs.xPath,
            timeOnPage: [211554, 351154],
            nextPageKey: lc_nav_pages.feed,
            currentPage: false,
            run: true
        },
        {
            key: lc_nav_pages.invitationManager,
            path: lc_element_xpath.invitationManager.attributes.href,
            xPath: lc_element_xpath.invitationManager.xPath,
            steps: ["//span[text() = 'Manage']", "//button[text() = 'Sent']"],
            timeOnPage: [2554, 3540],
            nextPageKey: lc_nav_pages.feed,
            currentPage: false,
            run: true
        }
    ],
    rootTimeout: 30000,
    rootInterval: null,
    currentPage: lc_nav_pages.feed,
    timeOuts: []
}