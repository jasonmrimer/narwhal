class MsnAssignment
  include Capybara::DSL
  include RSpec::Matchers
  attr_reader :msn_title

  def initialize
    @msn_title = 'XXX1F01'
  end

  def create
    page.within('.side-panel') do
      find('a', text: 'AVAILABILITY').click
      click_link_or_button 'Add Event'
      find('label', text: 'MISSION').click
      typeahead('Mission ID', @msn_title)
      click(find('input[type="submit"]'))
    end
  end

  private

  def typeahead(item, value)
    fill_in(item, with: value)
    click_link(value)
  end

  def click(element)
    script = <<-JS
      arguments[0].click();
    JS

    Capybara.current_session.driver.browser.execute_script(script, element.native)
  end
end