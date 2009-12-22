///argh. prototype.

var SiteChooser = Class.create({
  initialize: function(element) {
    this.header = element.firstDescendant();
    this.choices = $(this.header.id.replace('show_', ''));
    $('main').makePositioned().insert(this.choices);
    this.header.observe('mouseover', this.show.bindAsEventListener(this));
    this.choices.observe('mouseover', this.show.bindAsEventListener(this));    
    this.header.observe('mouseout', this.hideSoon.bindAsEventListener(this));
    this.choices.observe('mouseout', this.hideSoon.bindAsEventListener(this));
    this.fx = null;
    this.delay = null;
    this.hide();
  },
  show: function (event) {
    this.interrupt();
    this.fx = Effect.Appear(this.choices, { duration: 0.2 });
  },
  hide: function (event) {
    this.interrupt();
    this.fx = Effect.Fade(this.choices, { duration: 1 });
  },
  hideSoon: function (event) {
    this.delay = this.hide.bind(this).delay(0.5);
  },
  interrupt: function () {
    if (this.fx) this.fx.cancel();
    if (this.delay) window.clearTimeout(this.delay);
  }
});

document.observe('dom:loaded', function() {
  when('site_chooser', function (chooser) {
    new SiteChooser(chooser);
  });
});