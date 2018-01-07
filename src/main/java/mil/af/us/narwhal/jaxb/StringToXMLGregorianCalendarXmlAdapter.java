package mil.af.us.narwhal.jaxb;

import javax.xml.bind.annotation.adapters.XmlAdapter;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.GregorianCalendar;

public class StringToXMLGregorianCalendarXmlAdapter extends XmlAdapter<String, XMLGregorianCalendar> {

  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MM-dd-uuuu'T'HH:mm:ss.0X");

  @Override
  public String marshal(XMLGregorianCalendar v) throws Exception {
    return null;
  }

  @Override
  public XMLGregorianCalendar unmarshal(String v) throws Exception {
    if (v.isEmpty()){
      return null;
    } else {
      ZonedDateTime zonedDateTime = ZonedDateTime.parse(v, FORMATTER);
      GregorianCalendar gregorianCalendar = GregorianCalendar.from(zonedDateTime);
      DatatypeFactory datatypeFactory = DatatypeFactory.newInstance();
      return datatypeFactory.newXMLGregorianCalendar(gregorianCalendar);
    }
  }
}