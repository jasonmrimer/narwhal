class CrewPage
  include Capybara::DSL
  include RSpec::Matchers

  def initialize(msn_title)
    page.within('.side-panel') do
      find('a', text: 'AVAILABILITY').click
      page.within('.event-title', text: msn_title) do
        find('a').click
      end
    end
  end

  def assert_has_assigned_airmen(*airmen)
    airmen.each { |airman| expect(page).to have_content(airman) }
  end
end