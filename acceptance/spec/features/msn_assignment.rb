class MsnAssignment
  include Capybara::DSL
  include RSpec::Matchers
  attr_reader :msn_title, :msn_id

  def initialize
    # @msn_title = Time.now.strftime("%D") + ' XXX-FAKE-MISSION-1'
    @msn_id = 'XXX-FAKE-MISSION-1'
    @msn_date = Time.now.strftime("%D")
    @msn_title = @msn_date + ' ' + @msn_id
  end

  def create
    page.within('.side-panel') do
      find('a', text: 'AVAILABILITY').click
      click_link_or_button '+ Add Event'
      find('label', text: 'MISSION').click
      typeahead('Mission ID', 'XXX-FAKE')
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