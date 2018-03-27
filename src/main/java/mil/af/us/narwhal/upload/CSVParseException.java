package mil.af.us.narwhal.upload;

import com.opencsv.exceptions.CsvException;

import java.util.List;

public class CSVParseException extends Exception {
  private List<CsvException> exceptions;

  public CSVParseException(List<CsvException> exceptions) {
    this.exceptions = exceptions;
  }
}
