package mil.af.us.narwhal.crew;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "template_item")
public class TemplateItem {
  @Id
  @GeneratedValue
  private Long id;

  @Column(name = "order_int")
  private Long order;

  private Boolean critical;

  @Column(name = "template_id")
  private Long templateId;
}