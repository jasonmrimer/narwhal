package mil.af.us.narwhal.upload;

import com.opencsv.exceptions.CsvException;

import java.util.List;

public class CSVParseException extends Exception {
  private List<CsvException> exceptions;

  public CSVParseException(List<CsvException> exceptions) {
    this.exceptions = exceptions;
  }

  @Override
  public String toString() {
    final StringBuilder sb = new StringBuilder("Upload was unsuccessful.\n");
    for (CsvException e : exceptions) {
      sb.append(e.getMessage());
      sb.append(" at line ");
      sb.append(e.getLineNumber());
      sb.append(".\n");
    }
    sb.replace((sb.length() - 1), sb.length(), "");
    return sb.toString();
  }
}
