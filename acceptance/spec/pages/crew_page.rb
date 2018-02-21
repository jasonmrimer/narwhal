class CrewPage
  include Capybara::DSL
  include RSpec::Matchers

  def initialize(msn_title)
    page.within('.side-panel') do
      find('a', text: 'AVAILABILITY').click
      page.within('.event-title', text: msn_title) do
        click(find('a'))
      end
    end
  end

  def assert_has_assigned_airmen(*airmen)
    airmen.each { |airman| expect(page).to have_content(airman) }
  end

  def click(element)
    script = <<-JS
      arguments[0].click();
    JS

    Capybara.current_session.driver.browser.execute_script(script, element.native)
  end
end