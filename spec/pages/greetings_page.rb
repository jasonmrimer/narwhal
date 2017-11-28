class GreetingsPage
    include Capybara::DSL

    def initialize
        visit '/'
    end

    def has_random_greeting?
        ['Whats up', 'Hola', 'Bonjour', 'Moshi Moshi', 'Gutentag'].any? { |word| page.text.include?(word) }
    end
end