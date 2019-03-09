//Wrapper function for page init event to prevent event from firing when going back
function onPageInit(pagename: string, callback: any, initialonly = true) {
    $$(document).on('page:init', '.page[data-name="' + pagename + '"]', function (e: any) {
        if (initialonly) {
            if (e.detail.direction !== 'backward') {
                callback(e);
            }
        } else {
            callback(e);
        }
    });
}

$$(document).on('page:init', function (e: any) {
    if (app.device.desktop) {
        $$('.mobilemenubutton').hide();
    }
});