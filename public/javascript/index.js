Vue.prototype.$http = axios

Vue.component("navbar", {
    template: navbar,
});

Vue.component("footer-bar", {
    template: footer,
    data: () => ({
        el: '#app',
        random: 0,
        quote: "",
        quotes: ['"All men are not created equal." ━ Izuku Midoriya',
            '"Maybe I failed this time, but I’m not giving up." ━ Shinsou Hitoshi',
            '"Dreams can become reality!" ━ Izuku Midoriya',
            '"The most inflated egos are often the most fragile." ━ All Might',
            '"Stop Talking, I will win. That’s… what heroes do." ━ Bakugou Katsuki',
            '"Isn’t it a hero’s job to save people?" ━ Shoto Todoroki',
            '"Heroes and villains both thrive on violence, but we’re still categorized. “You’re good” “You’re evil”." ━ Shigaraki Tomura',
            '"The most inflated egos are often the most fragile." ━ All Might',
            '"Whether you win or lose, looking back and learning from your experience is a part of life." ━ All Might',

        ],
    }),

    methods: {

      loadQuotes () {
        axios.get('http://localhost:8080/quotes').then((response) => {
            this.quotes = response.data
          });
        },
        ready() {
          //  this.random = Math.floor(Math.random() * this.quotes.length);
           // this.quote = this.quotes[this.random];

            this.loadQuotes()
            setInterval(function () {
              this.loadQuotes()
            }.bind(this), 30000)
        },
        ready: function () {

            this.random = Math.floor(Math.random() * this.quotes.length);
            this.quote = this.quotes[this.random];
        }
    },
    created() {
        this.ready();
    }

});

Vue.component('carousel-component', {
    render: function (createElement) {
        return createElement('div', {
                class: 'carousel-component'
            },
            this.items.map((item, index) =>
                createElement('div', {
                    'class': 'carousel-page' + (this.current === index ?
                        ' active' : ''),
                    style: {
                        transform: `translate3d(${this.position(index) * 100}%, 0, 0)`,
                    }
                }, [item])
            ).concat([
                createElement('button', {
                    'class': 'carousel-nav-prev',
                    on: {
                        click: () => {
                            this.decreaseCurrent();
                        }
                    }
                }, 'Prev'),
                createElement('button', {
                    'class': 'carousel-nav-next',
                    on: {
                        click: () => {
                            this.increaseCurrent();
                        }
                    }
                }, 'Next')
            ])
        );
    },
    data: function () {
        return {
            current: 0
        };
    },
    computed: {
        items: function () {
            return this.$slots.default.filter(function (item) {
                return item.componentOptions !== undefined &&
                    item.componentOptions.tag === 'carousel-item';
            });
        }
    },
    methods: {
        decreaseCurrent: function () {
            this.current += this.items.length - 1;
            this.current %= this.items.length;
        },
        increaseCurrent: function () {
            this.current += 1;
            this.current %= this.items.length;
        },
        position: function (index) {
            if (index === this.current) return 0;
            if (index === (this.current + 1) % this.items.length) return 1;
            return -1;
        }
    }
});

Vue.component('carousel-item', {
    render: function (createElement) {
        return createElement('div', {
            class: 'carousel-item'
        }, this.$slots.default);
    }
});


Vue.component("characters-component", {
    template: characters,
});

let vue = new Vue({
    el: '#app',
    data: {
      persos: [],
        username: "",
        password: "",
        random: 0,
        quote: "",
        selectedPerso: -1
    },
    methods: {
      loadData () {
        axios.get('http://localhost:8080/persos').then((response) => {
            this.persos = response.data
          });
        },
        ready() {
          //  this.random = Math.floor(Math.random() * this.quotes.length);
           // this.quote = this.quotes[this.random];

            this.loadData()
            setInterval(function () {
              this.loadData()
            }.bind(this), 30000)
        },

        hoverCard(selectedIndex) {
            this.selectedPerso = selectedIndex
            this.animateCards()
        },
        animateCards() {
            this.persos.forEach((perso, index) => {
                const direction = this.calculateCardDirection(index, this.selectedPerso)
                TweenMax.to(
                    this.$refs[`card_${index}`],
                    0.3,
                    {x: direction * 50}
                )
            })
        },
        calculateCardDirection(cardIndex, selectedIndex) {
            if (selectedIndex === -1) {
                return 0
            }

            const diff = cardIndex - selectedIndex
            return diff === 0 ? 0 : diff / Math.abs(diff)
        },
        isSelected(cardIndex) {
            return this.selectedPerso === cardIndex
        }
    },
    mounted: function () {
        this.ready();
    }
});
