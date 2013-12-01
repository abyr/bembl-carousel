modules.define('i-bem__dom', function(provide, DOM) {

    var root = this;

    DOM.decl('b-carousel', {

        onSetMod: {
            'js': {
                'inited': function() {
                    this._setup();
                    this._setupControls();
                }
            },
            'ready': function() {
                if (this._autostart) {
                    setTimeout(function(ctx){
                        ctx._togglePlay();
                    }, this._delaySlideMs, this);
                }
            },
            'play': function(mod, val, oldVal) {
                if (!val && oldVal) {
                    this._stop();
                }
            }
        },

        // this.params

        _started: false,

        _autostart: false,

        _delaySlideMs: 2000,

        _currentItemIndex: 0,

        _itemWidth: 0, // px
        _slideWidth: 0, // px

        _itemsOnSlide: 1,

        _setup: function() {

            if (this.elem('container').size()) {

                this._itemWidth = this.elem('item').first().innerWidth()
                this._slideWidth = this.domElem.innerWidth();

                this._itemsOnSlide = Math.floor(this._slideWidth / this._itemWidth) || 1;

            } else {
                throw new Error('Setup failed.')
            }

            this._autostart = this.hasMod('autostart') || false;

            this.setMod('ready', true);
        },

        _setupControls: function() {

            // TODO: bind to block

            this.bindTo(this.elem('control'), 'click', function(){
                this.setMod('play', false);
            }, this);

            this.bindTo(this.elem('control', 'type', 'next'), 'click', function(){
                this._next();
            }, this);
            this.bindTo(this.elem('control', 'type', 'prev'), 'click', function(){
                this._prev();
            }, this);
        },

        _slide: function(duration) {
            index = this._currentItemIndex;
            if (duration) {
                duration = (duration/1000) + "s";
                this.elem('container').css("transition", duration);
            }
            target = '-' + (index*this._itemWidth) + 'px';
            target = "translate(" + target + ",0)";
            this.elem('container').css('transform', target);
        },

        _togglePlay: function() {
            if (this._started) {
                this._stop();
            } else {
                // stopped
                this._play();
            }
        },

        _play: function() {
            if (!this._started) {
                this._started = setInterval(function(ctx){
                    ctx._next();
                    // ctx._prev();
                }, this._delaySlideMs, this);
                this.setMod('play', true);
            }
        },

        _stop: function() {
            if (this._started) {
                clearInterval(this._started);
                this._started = false;
                this.setMod('play', false);
            }
        },

        _next: function() {
            this._currentItemIndex += this._itemsOnSlide;
            lastIndex = this.elem('item').length - this._itemsOnSlide
            if (this._currentItemIndex > lastIndex) {
                this._currentItemIndex = lastIndex;
            }
            this._slide();
            if (this._currentItemIndex === lastIndex) {
                this._currentItemIndex = -this._itemsOnSlide;
            }
        },

        _prev: function() {
            this._currentItemIndex -= this._itemsOnSlide;
            if (this._currentItemIndex < 0) {
                this._currentItemIndex = 0;
            }
            this._slide();
            if (this._currentItemIndex === 0) {
                this._currentItemIndex = this.elem('item').length;
            }
            lastIndex = this.elem('item').length - this._itemsOnSlide
        }

    });

    provide(DOM);

});

