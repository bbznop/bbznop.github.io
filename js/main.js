/**
 * Sets up Justified Gallery.
 */
if (!!$.prototype.justifiedGallery) {
  var options = {
    rowHeight: 140,
    margins: 4,
    lastRow: "justify"
  };
  $(".article-gallery").justifiedGallery(options);
}

$(document).ready(function() {

  /**
   * Shows the responsive navigation menu on mobile.
   */
  $("#header #nav > ul > .icon").click(function() {
    $("#header #nav > ul").toggleClass("responsive");
  });


  /**
   * Keep article navigation available in either scroll direction.
   */
  if ($(".post").length) {
    /**
     * Keep the mobile navigation bar visible in either scroll direction.
     */
    if ($( "#footer-post").length) {
      $(window).on("scroll", function() {
        var topDistance = $(window).scrollTop();

        // close all submenu"s on scroll
        $("#nav-footer").hide();
        $("#toc-footer").hide();
        $("#share-footer").hide();

        // show a "navigation" icon when close to the top of the page, 
        // otherwise show a "scroll to the top" icon
        if (topDistance < 50) {
          $("#actions-footer > #top").hide();
        } else if (topDistance > 100) {
          $("#actions-footer > #top").show();
        }
      });
    }
  }
});
