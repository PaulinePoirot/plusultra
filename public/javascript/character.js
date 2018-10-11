var app = new Vue({
  el: '#app',
  data: {
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
  },

  methods: {
    ready: function() {
      this.random = Math.floor(Math.random() * this.quotes.length) + 0;

      this.quote = this.quotes[this.random];
      this.person = this.persons[this.random];
    }
  },
  mounted() {
    this.ready();
  }

})
