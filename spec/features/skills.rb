class Skill
  include Capybara::DSL
  include RSpec::Matchers
  attr_accessor :earn, :expiration

  def initialize
    set_attrs
  end

  def create_qualification
    page.within('.side-panel') do
      click_link_or_button 'CURRENCY'
      click_link_or_button '+ Add Skill'
      select 'Qualification', from: 'Type:'
      select 'XW', from: 'Name:'
      continue_submission
    end
  end

  def create_certification
    page.within('.side-panel') do
      click_link_or_button 'CURRENCY'
      click_link_or_button '+ Add Skill'
      select 'Certification', from: 'Type:'
      select 'X-Ray Vision', from: 'Name:'
      continue_submission
    end
  end

  def qualification_exists?
    page.within('.side-panel') do
      page.has_content?('CURRENCY') &&
      page.has_content?(@expiration.strftime('%d %b %y')) &&
      page.has_content?('XW')
    end
  end

  def certification_exists?
    page.within('.side-panel') do
      page.has_content?('CURRENCY') &&
      page.has_content?(@expiration.strftime('%d %b %y')) &&
      page.has_content?('X-Ray Vision')
    end
  end

  private

  def set_attrs
    @earn = Time.now.utc
    @expiration = @earn + 36000000
  end

  def continue_submission
    fill_in 'earnDate', with: @earn.strftime('%m/%d/%Y')
    fill_in 'expirationDate', with: @expiration.strftime('%m/%d/%Y')
    find('input[type="submit"]').click
  end

  def scroll_to(element)
    script = <<-JS
      arguments[0].scrollIntoView(true);
    JS

    Capybara.current_session.driver.browser.execute_script(script, element.native)
  end
end
