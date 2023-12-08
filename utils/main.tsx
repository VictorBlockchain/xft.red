export function preloader() {
   // $('.cs-preloader').delay(150).fadeOut('slow');
  }
  
  export function smoothScroll() {
    $(".cs-smoth_scroll").on("click", function () {
      var thisAttr = $(this).attr("href");
  
      if (thisAttr !== undefined && thisAttr !== '') {
        var targetElement = $(thisAttr);
        if (targetElement.length) {
          var offset = targetElement.offset();
          if (offset !== undefined) {
            var scrollPoint = offset.top - 120;
  
            $("body,html").animate(
              {
                scrollTop: scrollPoint,
              },
              600
            );
          }
        }
      }
  
      return false;
    });
  }
  
  export function dynamicBackground() {
    $('[data-src]').each(function () {
      var src = $(this).attr('data-src');
      if (src) {
        $(this).css({
          'background-image': 'url(' + src + ')',
        });
      }
    });
  }