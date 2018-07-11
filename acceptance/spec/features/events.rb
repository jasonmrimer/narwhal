class Event
  include Capybara::DSL
  include RSpec::Matchers
  attr_accessor :start, :end, :title

  def initialize
    set_attrs
  end

  def create_invalid
    page.within('.side-panel') do
      find('a', text: 'AVAILABILITY').click
      click_link_or_button 'Add Event'
      find('label', text: 'APPOINTMENT').click

      fill_in 'description', with: "invalid event"
      click(find('input[type="submit"]'))
    end
  end

  def create
    page.within('.side-panel') do
      find('a', text: 'AVAILABILITY').click
      click_link_or_button 'Add Event'
      find('label', text: 'APPOINTMENT').click

      fill_in 'title', with: @title
      page.all('.DateInput_input')[0].set(@start.strftime('%m/%d/%Y'))
      fill_in 'startTime', with: @start.strftime('%H:%M')
      page.all('.DateInput_input')[1].set('')
      page.all('.DateInput_input')[1].set(@end.strftime('%m/%d/%Y'))
      fill_in 'endTime', with: @end.strftime('%H:%M')
      click(find('input[type="submit"]'))
      sleep 10
    end
  end

  def update
    page.within('.side-panel') do
      find('a', text: 'AVAILABILITY').click
      click(page.all('.event-title', text: @title)[0])
      expect(find_field('title').value).to eq @title

      set_attrs

      fill_in 'title', with: @title
      page.all('.DateInput_input')[0].set('')
      page.all('.DateInput_input')[0].set(@start.strftime('%m/%d/%Y'))
      fill_in 'startTime', with: @start.strftime('%H:%M')
      page.all('.DateInput_input')[1].set('')
      page.all('.DateInput_input')[1].set(@end.strftime('%m/%d/%Y'))
      fill_in 'endTime', with: @end.strftime('%H:%M')
      click(find('input[type="submit"]'))
    end
  end

  def delete
    page.within('.side-panel') do
      find('a', text: 'AVAILABILITY').click
      click(page.all('.event-title', text: @title)[0])
      click(page.find('button[type="button"]', text: 'DELETE'))
    end

    expect(page.has_content?('REMOVE EVENT')).to be true

    page.within('.actions') do
      click_link_or_button 'BACK'
    end

    expect(page.has_content?('REMOVE EVENT')).to be false

    click(page.find('button[type="button"]', text: 'DELETE'))

    expect(page.has_content?('REMOVE EVENT')).to be true

    page.within('.actions') do
      click_link_or_button 'CONFIRM'
    end

  end

  def exists?
    page.within('.side-panel') do
      page.has_content?('AVAILABILITY') &&
          page.has_content?(@start.strftime('%d %^b %y')) &&
          page.has_content?(@title) &&
          page.has_content?(@start.strftime('%H%ML') + ' - ' + @end.strftime('%H%ML'))
    end
  end

  private

  def set_attrs
    @start = Time.now
    @end = @start + (60 * 60 * 36)
    @title = "Test Event"
  end

  def click(element)
    script = <<-JS
      arguments[0].click();
    JS

    Capybara.current_session.driver.browser.execute_script(script, element.native)
  end
end