class DashboardPage
    include Capybara::DSL
    def initialize 
        visit '/dashboard'
    end

    def has_missions?
        page.has_content?('A')
        page.has_content?('B')
        page.has_content?('C')
        page.has_content?('MSN DATE: 1 JAN 18')
        page.has_content?('MSN START: 0130Z')
        page.has_content?('MSN END: 1130Z')
    end
end