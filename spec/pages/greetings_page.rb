class GreetingsPage
    include Capybara::DSL

    def initialize
        visit '/'
    end

    def has_random_greeting?
        page.has_text? /Whats\sup|Hola|Bonjour|Moshi\sMoshi|Gutentag/            
    end
end