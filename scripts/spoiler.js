$(document).ready(() => {
    $('.spoiler-trigger').click((e) => {
        let el = $(e.target);
        while(!el.hasClass("spoiler-trigger")){
            el = el.parent();
        }
        $(el).toggleClass('active');
        $(el).parent().find('.spoiler-block').first().slideToggle(300);
        return false;
    });
});