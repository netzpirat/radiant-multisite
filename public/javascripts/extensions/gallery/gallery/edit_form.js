if (!Gallery) var Gallery = {};

Gallery.EditForm = {

    init: function(popup, link) {
        if (!this.submitHandler) this.initializeHandler();
        var item = link.up('.item');
        popup.down('form').setAttribute('action', link.getAttribute('href'));
        var name = item.down('.label a').innerHTML;
        if (name == '&nbsp;') name = '';
        $('edit-item-name').value = name;
        $('edit-item-description').value = item.down('.description').innerHTML;
        $('edit-item-keywords').value = item.down('.keywords').innerHTML;
    },

    initializeHandler: function() {
        this.submitHandler = $('edit-gallery-item-popup').down('form').observe('submit', this.handleFormSubmit);
    },

    open: function(link) {
        var popup = $('edit-gallery-item-popup');
        this.init(popup, link);
        this.show(popup);
    },

    show: function(popup) {
        center(popup.show());
        popup.setStyle({
            top: '100px'
        });
    },

    close: function() {
        var popup = $('edit-gallery-item-popup');
        popup.hide();
        this.reset(popup);
    },

    reset: function(popup) {
        popup.down('form').setAttribute('action', '');
        $('edit-item-name').value = '';
        $('edit-item-description').value = '';
        $('edit-item-keywords').value = '';
        $('edit-spinner').hide();
        $('edit-submit').show();
    },

    handleFormSubmit: function(event) {
        event.stop();
        var url = event.target.getAttribute('action');
        var name = $('edit-item-name').value;
        var description = $('edit-item-description').value;
        var keywords = $('edit-item-keywords').value;
        $('edit-spinner').show();
        $('edit-submit').hide();
        new Ajax.Request(url, {
            method: 'put',
            parameters: {
                'gallery_item[name]': name,
                'gallery_item[description]': description,
                'gallery_item[keywords]': keywords,
                authenticity_token: $('authenticity_token').value
            }
        });

    }

}