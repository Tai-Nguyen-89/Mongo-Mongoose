// Global bootbox. What's a bootbox? Bootbox.js is a small JavaScript library which allows you to create programmatic dialog boxes using Bootstrap modals, without having to worry about creating, managing, or removing any of the required DOM elements or JavaScript event handlers.

$(document).ready(function() {
    // Setting a ref to article-container div where all dynamic info will go
    // Adding event listener to generated saved article and to scrape new article buttons
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
    // When pg is rdy, run the initPage to start
    initPage();

    function initPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=false").then(function(data) {
            if (data && data.length) {
                renderArticles(data);
            } else {
                renderEmpty();
            }
        });
    }

    // handles appending HTML containing our article data to the page. Passes array of JSON containing all avaialbe articles in our database
    function renderArticles(articles) {
        var articlePanels = [];

        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.headline,
                "<a class='btn btn-success save'>",
                "Save Article</a></h3></div>",
                "<div class='panel-body'>",
                article.summary,
                "</div></div>",
            ].join(""));
        panel.data("_id", article._id);
        return panel;
    }

    function renderEmpty() {
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>There are no new articles.</h4></div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>What would you like to do?</h3></div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape-new'>Try Scraping a new article</a></h4>",
                "<h4><a href='/saved'>Go to Saved Articles</a></h4></div></div>",
            ].join(""));
        articleContainer.append(emptyAlert);
    }

    function createPanel(article) {
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'><h3>",
                article.headline,
                "<a class='btn btn-success save'>",
                "Save Article</a></h3></div>",
                "<div class='panel-body'>",
                article.summary,
                "</div></div>"
            ].join(""));
        panel.data("_id", article._id);

        return panel;
    }

    function handleArticleSave() {
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;
        $.ajax({
                method: "PATCH",
                url: "/api/headlines",
                data: articleToSave
            })
            .then(function(data) {
                if (data.ok) {
                    initPage();
                }
            });
    }

    function handleArticleScrape() {
        $.get("/api/fetch")
            .then(function(data) {
                initPage();
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");
            })
    }
})